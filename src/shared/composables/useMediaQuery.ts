import { onBeforeUnmount, onMounted, ref } from 'vue';

/** Reactive `matchMedia` — e.g. `useMediaQuery('(max-width: 767px)')`. */
export function useMediaQuery(query: string) {
  const mql = window.matchMedia(query);
  const matches = ref(mql.matches);
  const onChange = (event: MediaQueryListEvent) => (matches.value = event.matches);

  onMounted(() => mql.addEventListener('change', onChange));
  onBeforeUnmount(() => mql.removeEventListener('change', onChange));

  return matches;
}
