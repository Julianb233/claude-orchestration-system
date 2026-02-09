# Six Sigma Frameworks & Methodology Reference

**Purpose:** Comprehensive reference for Sterling-SixSigma agent and AI Acrobatics consulting operations.

---

## Quick Reference

### When to Use Which Methodology

| Scenario | Methodology | Key Indicator |
|----------|-------------|---------------|
| Existing process has problems | **DMAIC** | "We have X but it's not working well" |
| Creating new process/product | **DMADV** | "We need to build X from scratch" |
| Waste reduction + variation | **Lean Six Sigma** | Both efficiency AND quality issues |

---

## DMAIC Methodology (Improving Existing Processes)

### Phase 1: DEFINE

**Objective:** Clearly articulate the problem, scope, and goals.

**Key Activities:**
1. Develop problem statement (specific, measurable, actionable)
2. Define project scope (in-scope vs out-of-scope)
3. Identify stakeholders and form team
4. Create project charter
5. Map high-level process (SIPOC)
6. Capture Voice of Customer (VOC)
7. Establish project timeline

**Tools:**
- **SIPOC Diagram** - Suppliers, Inputs, Process, Outputs, Customers
- **VOC (Voice of Customer)** - Surveys, interviews, complaints analysis
- **Project Charter** - Problem, scope, goals, team, timeline
- **Stakeholder Analysis** - Power/interest grid

**Define Phase Outputs:**
- Project charter signed off
- SIPOC diagram complete
- VOC data collected
- CTQs (Critical to Quality) identified
- Business case with expected benefits

**Consultation Analysis Prompts:**
- What specific problem is the client experiencing?
- Who are the customers affected?
- What does "success" look like?
- What is in/out of scope?

---

### Phase 2: MEASURE

**Objective:** Establish baseline performance and validate measurement system.

**Key Activities:**
1. Identify key metrics (Y = f(x))
2. Develop data collection plan
3. Validate measurement system (Gage R&R)
4. Collect baseline data
5. Calculate current process capability
6. Establish sigma level baseline

**Tools:**
- **Data Collection Plan** - What, where, when, how, who
- **Measurement System Analysis (MSA)** - Gage R&R
- **Process Capability Analysis** - Cp, Cpk, Pp, Ppk
- **Control Charts** - For baseline stability
- **Pareto Charts** - Identify vital few issues
- **Histograms** - Data distribution

**Key Metrics:**
```
DPMO = (Defects / (Units × Opportunities)) × 1,000,000
Sigma Level = NORMSINV(1 - DPMO/1,000,000) + 1.5
Yield = (1 - DPMO/1,000,000) × 100%

Process Capability:
Cp = (USL - LSL) / (6 × σ)
Cpk = min[(USL - μ) / (3σ), (μ - LSL) / (3σ)]
```

**Sigma Level Reference:**
| Sigma | DPMO | Yield | Cpk |
|-------|------|-------|-----|
| 1 | 690,000 | 31.0% | 0.33 |
| 2 | 308,000 | 69.2% | 0.67 |
| 3 | 66,800 | 93.3% | 1.00 |
| 4 | 6,210 | 99.4% | 1.33 |
| 5 | 233 | 99.98% | 1.67 |
| 6 | 3.4 | 99.9997% | 2.00 |

**Measure Phase Outputs:**
- Validated measurement system
- Baseline data collected
- Current sigma level calculated
- Data stratified by key factors
- Updated project scope (if needed)

**Consultation Analysis Prompts:**
- What data does the client currently track?
- How is quality/success measured today?
- What's the defect rate or error rate?
- How many opportunities for defects per unit?

---

### Phase 3: ANALYZE

**Objective:** Identify and verify root causes of problems.

**Key Activities:**
1. Develop cause-and-effect hypotheses
2. Stratify data to identify patterns
3. Perform root cause analysis
4. Use statistical analysis to verify causes
5. Quantify impact of root causes
6. Prioritize causes for improvement

**Tools:**
- **Fishbone Diagram (Ishikawa)** - Categories: Man, Machine, Method, Material, Measurement, Environment
- **5 Whys Analysis** - Drill down to root cause
- **Pareto Analysis** - 80/20 rule application
- **Scatter Plots** - Correlation analysis
- **Regression Analysis** - Quantify relationships
- **Hypothesis Testing** - T-tests, ANOVA, Chi-square
- **FMEA** - Failure Modes and Effects Analysis

**FMEA Risk Priority Number:**
```
RPN = Severity × Occurrence × Detection
Scale: 1-10 for each factor
High RPN (>100) = Priority action needed
```

**Statistical Tests Selection:**
| Data Types | Test |
|------------|------|
| Continuous vs Continuous | Correlation, Regression |
| Continuous vs Categorical (2 groups) | T-test |
| Continuous vs Categorical (3+ groups) | ANOVA |
| Categorical vs Categorical | Chi-square |

**Analyze Phase Outputs:**
- Verified root causes with data
- Quantified impact of each cause
- Prioritized list of improvement opportunities
- Statistical validation of relationships

**Consultation Analysis Prompts:**
- What does the client think causes the problem?
- Where do errors typically occur?
- When did the problem start or worsen?
- What correlations exist in available data?

---

### Phase 4: IMPROVE

**Objective:** Develop, test, and implement solutions.

**Key Activities:**
1. Generate solution ideas (brainstorming)
2. Evaluate and select best solutions
3. Pilot test solutions
4. Optimize solution using DOE
5. Develop implementation plan
6. Implement changes
7. Verify improvement results

**Tools:**
- **Brainstorming/Affinity Diagrams** - Generate ideas
- **Solution Selection Matrix** - Evaluate options
- **Pilot Testing** - Small-scale trials
- **Design of Experiments (DOE)** - Optimize factors
- **Poka-Yoke** - Mistake-proofing
- **Standard Work** - Document new process
- **5S** - Workplace organization

**Solution Evaluation Criteria:**
| Criterion | Weight | Score 1-5 |
|-----------|--------|-----------|
| Impact on problem | High | ? |
| Cost to implement | Medium | ? |
| Time to implement | Medium | ? |
| Risk | High | ? |
| Sustainability | High | ? |

**Improve Phase Outputs:**
- Implemented solutions
- Verified improvement in metrics
- Updated process documentation
- Training completed
- Quick wins captured

**Consultation Analysis Prompts:**
- What solutions has the client already tried?
- What resources are available for implementation?
- What constraints exist (budget, time, people)?
- What's the appetite for change?

---

### Phase 5: CONTROL

**Objective:** Sustain improvements over time.

**Key Activities:**
1. Develop control plan
2. Implement statistical process control
3. Create response plan for out-of-control conditions
4. Update process documentation
5. Transfer ownership to process owner
6. Calculate final results and ROI
7. Document lessons learned

**Tools:**
- **Control Charts** - X-bar/R, P-chart, C-chart
- **Control Plan** - What, how, who, when to monitor
- **Standard Operating Procedures (SOPs)** - Document new process
- **Visual Management** - Dashboards, status boards
- **Audit Checklist** - Verify adherence
- **Training Plan** - Sustain knowledge

**Control Chart Selection:**
| Data Type | Sample Size | Chart Type |
|-----------|-------------|------------|
| Continuous | n=1 | I-MR (Individual-Moving Range) |
| Continuous | n=2-10 | X-bar and R |
| Continuous | n>10 | X-bar and S |
| Attribute (defective) | Variable n | P-chart |
| Attribute (defects) | Fixed n | C-chart |
| Attribute (defects) | Variable n | U-chart |

**Control Limits:**
```
UCL = Mean + 3σ
LCL = Mean - 3σ
(Based on ±3 standard deviations = 99.73% of data)
```

**Control Phase Outputs:**
- Control plan implemented
- Control charts active
- Process owner trained
- Final sigma level calculated
- ROI documented
- Project closed

---

## DMADV Methodology (Design for Six Sigma)

Use when creating NEW processes or products from scratch.

### Phase 1: DEFINE
- Define project goals based on customer needs
- Identify target market and voice of customer
- Create design charter

### Phase 2: MEASURE
- Measure customer needs and specifications
- Develop CTQ (Critical to Quality) characteristics
- Set design targets and specifications

### Phase 3: ANALYZE
- Analyze design options
- Evaluate alternatives against CTQs
- Select optimal design concept

### Phase 4: DESIGN
- Develop detailed design
- Create prototypes
- Run simulations and tests
- Optimize design

### Phase 5: VERIFY
- Verify design meets requirements
- Pilot test with customers
- Launch and monitor
- Hand off to operations

---

## Six Sigma Tools Quick Reference

### Voice of Customer (VOC) Tools

| Tool | Use Case |
|------|----------|
| **Surveys** | Quantitative customer feedback |
| **Interviews** | Deep qualitative insights |
| **Focus Groups** | Group dynamics, idea generation |
| **Complaints Analysis** | Reactive quality data |
| **Kano Model** | Classify requirements (Must-be, Performance, Delighter) |
| **QFD (House of Quality)** | Translate VOC to technical specs |
| **CTQ Tree** | Drill down needs to measurable specs |

### Process Analysis Tools

| Tool | Use Case |
|------|----------|
| **SIPOC** | High-level process overview |
| **Process Map** | Detailed step-by-step flow |
| **Value Stream Map** | Identify waste and value-add |
| **Swim Lane Diagram** | Show handoffs between roles |
| **Spaghetti Diagram** | Physical movement analysis |

### Root Cause Analysis Tools

| Tool | Use Case |
|------|----------|
| **5 Whys** | Quick drill-down to root cause |
| **Fishbone (Ishikawa)** | Structured cause categorization |
| **Fault Tree Analysis** | Logic-based failure analysis |
| **Pareto Chart** | Identify vital few causes |
| **Scatter Plot** | Visualize correlations |

### Statistical Tools

| Tool | Use Case |
|------|----------|
| **Descriptive Statistics** | Mean, median, std dev, range |
| **Histogram** | Data distribution shape |
| **Box Plot** | Outliers and variation |
| **Hypothesis Testing** | Validate cause-effect |
| **Regression** | Quantify relationships |
| **DOE** | Optimize multiple factors |
| **Control Charts** | Monitor process stability |

### Improvement Tools

| Tool | Use Case |
|------|----------|
| **Brainstorming** | Generate solution ideas |
| **Affinity Diagram** | Organize ideas into themes |
| **Solution Matrix** | Evaluate and select solutions |
| **Poka-Yoke** | Error-proof the process |
| **5S** | Workplace organization |
| **Kaizen** | Continuous improvement events |

---

## Lean Six Sigma Integration

Combines Six Sigma (variation reduction) with Lean (waste elimination).

### 8 Wastes (DOWNTIME)

| Waste | Description | Six Sigma Link |
|-------|-------------|----------------|
| **D**efects | Errors requiring rework | Core Six Sigma focus |
| **O**verproduction | Making more than needed | Increases defect exposure |
| **W**aiting | Idle time between steps | Process inefficiency |
| **N**on-utilized talent | Underusing people skills | Missing improvement ideas |
| **T**ransportation | Unnecessary movement of materials | Handling damage risk |
| **I**nventory | Excess stock | Hidden defects |
| **M**otion | Unnecessary worker movement | Fatigue, errors |
| **E**xtra processing | Doing more than required | Over-engineering |

---

## Consultation Analysis Framework

### Step 1: Extract VOC from Meeting Notes

Identify statements about:
- Customer complaints
- Quality issues
- Process bottlenecks
- Delivery problems
- Cost overruns
- Employee frustrations

### Step 2: Categorize Issues

Map to Six Sigma categories:
- **Quality Defects** - Errors, mistakes, failures
- **Variation** - Inconsistency in outputs
- **Process Waste** - Non-value-add activities
- **Capability Gap** - Process can't meet specs

### Step 3: Estimate Current State

Based on client descriptions:
- Low quality awareness = ~2-3 sigma
- Some quality tracking = ~3-4 sigma
- Active improvement programs = ~4-5 sigma
- World-class operations = ~5-6 sigma

### Step 4: Prioritize Opportunities

Use criteria:
- Customer impact (High/Medium/Low)
- Business impact (Revenue, cost, risk)
- Feasibility (Quick win vs. long-term)
- Strategic alignment

### Step 5: Recommend Approach

Output should include:
1. Problem statement (SMART)
2. Recommended methodology (DMAIC/DMADV/Lean)
3. Key metrics to track
4. Suggested tools for each phase
5. Expected timeline
6. Success criteria

---

## AI Consulting Integration Points

### Where AI/Automation Fits in Six Sigma

| Phase | AI Application |
|-------|----------------|
| Define | NLP for VOC analysis, sentiment analysis |
| Measure | Automated data collection, anomaly detection |
| Analyze | ML for pattern recognition, predictive analytics |
| Improve | Process automation (RPA), AI-assisted decision making |
| Control | Real-time monitoring, automated alerts |

### AI Acrobatics Value Proposition

1. **Faster Analysis** - AI accelerates data analysis
2. **Pattern Recognition** - ML finds hidden correlations
3. **Automation** - RPA eliminates manual waste
4. **Predictive** - Forecast issues before they occur
5. **Continuous** - 24/7 monitoring and improvement

### Recommended AI Tools by Waste Type

| Waste | AI Solution |
|-------|-------------|
| Defects | Computer vision, anomaly detection |
| Overproduction | Demand forecasting ML |
| Waiting | Process mining, bottleneck prediction |
| Non-utilized talent | Skills matching AI |
| Transportation | Route optimization |
| Inventory | Inventory optimization ML |
| Motion | Workflow automation (RPA) |
| Extra processing | Document automation, NLP |

---

## Quick Decision Guide for Sterling

### Client Says → Sterling Recommends

| Client Statement | Methodology | First Tool |
|------------------|-------------|------------|
| "Quality is inconsistent" | DMAIC | Control charts + MSA |
| "Too many errors" | DMAIC | Pareto + Fishbone |
| "Process is too slow" | Lean + DMAIC | Value stream map |
| "Customers are complaining" | DMAIC | VOC + CTQ tree |
| "Building new product" | DMADV | QFD + Kano |
| "Don't know what to measure" | Define phase | SIPOC + CTQ |
| "Tried fixes but problems return" | Control phase | Control plan + SPC |
| "Need to scale operations" | Lean + DMADV | Standardization + automation |

---

## Sources

- ASQ (American Society for Quality)
- IASSC (International Association for Six Sigma Certification)
- Lean Enterprise Institute
- Motorola Six Sigma methodology (original source)
- GE Six Sigma deployment model
