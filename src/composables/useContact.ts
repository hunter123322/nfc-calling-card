import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { useContactsStore, type ContactLoadStatus } from '../stores/contacts'
import { normalizeContactCode } from '../utils/contact-validator'

/** Loads one contact card through the shared Pinia cache. */
export function useContact(code: MaybeRefOrGetter<string>) {
    const store = useContactsStore()
    const key = computed(() => normalizeContactCode(toValue(code)))

    const contact = computed(() =>
        store.current && store.current.code === key.value ? store.current : null,
    )

    const status = computed<ContactLoadStatus>(() => {
        if (store.requestedCode === key.value) return store.status
        // Keep showing the previous card while a guarded navigation resolves.
        if (contact.value) return 'ready'
        return 'idle'
    })

    const isLoading = computed(() => status.value === 'idle' || status.value === 'loading')
    const notFound = computed(() => status.value === 'not-found')
    const hasError = computed(() => status.value === 'error')
    const errorMessage = computed(() => store.errorMessage)

    watch(
        key,
        (value) => {
            if (value) void store.load(value)
        },
        { immediate: true },
    )

    function retry(): void {
        void store.retry()
    }

    return { contact, status, isLoading, notFound, hasError, errorMessage, retry }
}
