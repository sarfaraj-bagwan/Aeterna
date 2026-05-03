# Aeterna Technical Algorithms

This document details the mathematical formulations and pseudocode for Aeterna's core decision engines.

## 1. The Harm Function (Macro-Scale Kill-Switch)

The system constantly evaluates a weighted sum of deviations from constitutional targets.

**Mathematical Formulation:**
$$H = \sum_{i=1}^{n} w_i \cdot \frac{|M_i - Target_i|}{Target_i}$$

Where:
- $M_i$: Current value of metric $i$ (e.g., Gini coeff, Unemployment).
- $w_i$: Normalized weight ($0 \le w_i \le 1$).
- $Target_i$: Hardcoded goal from the Root-Logic Layer.

**Pseudocode:**
```python
def compute_harm(snapshot):
    weights = {'gini': 0.25, 'unemployment': 0.20, 'corruption': 0.15 ...}
    targets = load_config('targets.json')
    total_harm = 0
    
    for metric, val in snapshot.items():
        delta = abs(val - targets[metric]) / targets[metric]
        total_harm += (weights[metric] * delta)
        
    threshold = targets.get_tolerance_threshold()
    if total_harm > threshold:
        trigger_enforcement(level="CRITICAL" if total_harm > threshold * 1.5 else "WARNING")
        
    return total_harm
```

## 2. Success DNA Cloning Decision Rule

Identifies genotypes (logical principles) from high-performing "donor" communities for replication in "recipient" nodes.

**Decision Logic:**
Clone from node $A$ to node $B$ if and only if:
1.  **Superiority:** $Score(A) > Score(B) + \delta$
2.  **Context Match:** $Similarity(A, B) > 0.6$
3.  **Stability:** Node $A$ has maintained growth for $\ge 3$ years.

**Mathematical Representation of Context Similarity:**
$$Sim(A, B) = \cos(\theta) = \frac{Vector_A \cdot Vector_B}{\|Vector_A\| \|Vector_B\|}$$
*Where the vectors represent socio-economic parameters like terrain, literacy, and resource density.*

## 3. Anomaly Detection (Layer 4)

Uses a 2-sigma band for baseline drift detection.

```python
def check_anomaly(metric_series):
    mean = calculate_moving_average(metric_series, window=90)
    std_dev = calculate_standard_deviation(metric_series, window=90)
    
    current_val = metric_series[-1]
    if abs(current_val - mean) > (2 * std_dev):
        generate_alert("Node Drift Detected")
```
