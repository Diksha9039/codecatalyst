export enum Classification {
  TRUE = "True",
  FALSE = "False",
  MISLEADING = "Misleading",
  UNVERIFIED = "Unverified",
  PARTIALLY_TRUE = "Partially True"
}

export interface Claim {
  claim: string;
  classification: Classification | string;
  explanation: string;
  correction: string;
  confidence: number;
}

export interface FactCheckResponse {
  cleaned_text: string;
  claims: Claim[];
}
