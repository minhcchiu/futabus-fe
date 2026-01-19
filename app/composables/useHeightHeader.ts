export const useHeightHeader = () => {
  const headerHeight = useState<string>("header-height", () => "h-56");

  const setHeaderHeight = (value: string) => {
    headerHeight.value = value;
  };

  return {
    headerHeight,
    setHeaderHeight,
  };
};
