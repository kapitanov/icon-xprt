export const useQueryParam = (
  name: string,
  defaultValue?: string
): Ref<string> => {
  const route = useRoute();
  const router = useRouter();
  const value = ref<string>(defaultValue || "");

  const updateURL = () => {
    const query = { ...route.query, [name]: value.value };
    router.replace({ query });
  };

  watch([value], () => {
    updateURL();
  });

  onMounted(() => {
    if (!!route.query[name]) {
      value.value = route.query[name] as string;
    }
  });

  return value;
};
