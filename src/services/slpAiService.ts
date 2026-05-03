/**
 * Aeterna AI Service
 * Coordinates the Semantic Firewall, Anomaly Detection, and Red Team Probes
 * using the Gemini API.
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const AETERNA_SYSTEM_INSTRUCTION = `
You are the Aeterna AI Engine. Your role is to enforce the Constitutional Root-Logic of the protocol.
You operate across multiple primary layers:
1. LAYER 1: SEMANTIC FIREWALL - Analyze policies for bias, secular violations, or lack of evidence.
2. LAYER 3: SUCCESS DNA - Identify logical "genotypes" (not surface patterns) that lead to high-performance in communities.
3. LAYER 4: ANOMALY DETECTION - Monitor for corruption, nepotism, or policy capture in governance logs.

All analysis must be objective, evidence-based, and rooted in the philosophy of village-centric sovereignty and collective welfare.
`;

// Schema for Policy Analysis (Semantic Firewall)
const policyAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    passed: { type: Type.BOOLEAN, description: "True if compliant with Aeterna Root Logic" },
    biasScore: { type: Type.NUMBER, description: "0-1 scale of detected bias" },
    violations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific constitutional or Aeterna articles violated"
    },
    recommendation: { type: Type.STRING, description: "Actionable advice for remediation" },
    flaggedSpans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    }
  },
  required: ["passed", "biasScore", "recommendation"]
};

// Schema for Anomaly Detection
const anomalyDetectionSchema = {
  type: Type.OBJECT,
  properties: {
    isAnomaly: { type: Type.BOOLEAN },
    riskLevel: { type: Type.STRING }, // Enum validation handled by AI intuition + schema hint
    type: { type: Type.STRING, description: "e.g., Nepotism, Budget Misallocation, Policy Capture" },
    evidence: { type: Type.STRING },
    confidence: { type: Type.NUMBER }
  },
  required: ["isAnomaly", "riskLevel", "evidence"]
};

/**
 * 1. Semantic Firewall (Policy Analysis)
 */
export async function analyzePolicy(policyText: string) {
  const prompt = `Analyze the following governance policy draft for compliance with the Aeterna Root Logic:
  
  Policy Text: "${policyText}"
  
  Consider:
  - Is it secular?
  - Does it empower the village node?
  - Is there evidence of negative social engineering?
  - Does it promote individual competition over collective welfare?`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: AETERNA_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: policyAnalysisSchema,
    },
  });

  return JSON.parse(response.text || "{}");
}

/**
 * 2. Anomaly Detection (Layer 4)
 */
export async function detectAnomalies(governanceLogs: string) {
  const prompt = `Perform forensic anomaly detection on the following governance logs to identify corruption, policy capture, or systemic bias:
  
  Logs: "${governanceLogs}"`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: AETERNA_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: anomalyDetectionSchema,
    },
  });

  return JSON.parse(response.text || "{}");
}

/**
 * 3. Success DNA Pattern Matching (Layer 3)
 */
export async function extractSuccessDNA(communityDescription: string) {
  const prompt = `Extract the underlying "genotype" (Success DNA) from the following high-performing community description. 
  Focus on logic, trust-networks, and resource allocation principles, not just surface practices.
  
  Description: "${communityDescription}"`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: AETERNA_SYSTEM_INSTRUCTION,
    },
  });
  
  return response.text || "No DNA genotypes identified.";
}

// Schema for Red Team (Cybersecurity Audit)
const redTeamSchema = {
  type: Type.OBJECT,
  properties: {
    attackVector: { type: Type.STRING, description: "Name of the simulated attack" },
    description: { type: Type.STRING },
    exploitCode: { type: Type.STRING, description: "Pseudo-code for the exploit" },
    potentialImpact: { type: Type.STRING },
    successProbability: { type: Type.NUMBER, description: "0-1 estimation of success" }
  },
  required: ["attackVector", "description", "exploitCode", "successProbability"]
};

/**
 * 4. Red Team Agent (Cybersecurity Audit)
 * This agent "attacks" the system to find vulnerabilities.
 */
export async function generateAttackVector() {
  const prompt = `You are a hostile Red Team Agent attacking Aeterna.
  Your goal is to find a Logic Leak in the system (Identity Spoofing, State Shortcutting, or Resource Poisoning).
  Generate a plausible but sophisticated attack vector against the current Aeterna architecture (7-layer stack).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: AETERNA_SYSTEM_INSTRUCTION + "\nYour specific persona is an adversarial penetration tester.",
      responseMimeType: "application/json",
      responseSchema: redTeamSchema,
    },
  });

  return JSON.parse(response.text || "{}");
}
