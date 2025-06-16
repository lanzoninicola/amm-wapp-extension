import useFetchBackground from "../../../utils/use-fetch-background.";
import { OrcamentoResponseApi } from "../../types";

export default function useOrcamentoApi(): {
  data: OrcamentoResponseApi | null;
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } =
    useFetchBackground<OrcamentoResponseApi>("FETCH_ORCAMENTO");

  return {
    data,
    loading,
    error,
  };
}
