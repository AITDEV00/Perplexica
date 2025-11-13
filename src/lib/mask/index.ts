import { getMaskingURL } from "../config/serverRegistry";

export interface MaskQueryReport {
  original_query: string;
  masked_query: string;
  query_changed: boolean;
  original_length: number;
  masked_length: number;
  error?: string;
}

export interface MaskQueryResponse {
  masked_query: string;
  report: MaskQueryReport;
}

export async function getMaskedQuery(
  query: string
): Promise<MaskQueryResponse> {
  const maskingURL = getMaskingURL();

  try {

    const response = await fetch(`${maskingURL}/mask-query`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as MaskQueryResponse;

    return data;
  } catch (error) {
    console.error(`❌ Masking API Error:`, error);
    throw error;
  }
}
