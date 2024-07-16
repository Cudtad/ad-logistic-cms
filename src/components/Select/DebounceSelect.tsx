import { debounce } from "@/utils/helpers";
import { Select, SelectProps, Spin } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  prefetch?: boolean;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 300,
  prefetch = false,
  ...props
}: DebounceSelectProps<ValueType | any>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  useEffect(() => {
    if (prefetch) {
      debounceFetcher();
    }
  }, [prefetch]);

  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      onFocus={() => debounceFetcher()}
      notFoundContent={
        fetching ? (
          <div className="flex justify-center">
            <Spin size="small" />
          </div>
        ) : null
      }
      {...props}
      options={options}
    />
  );
}

export default DebounceSelect;
