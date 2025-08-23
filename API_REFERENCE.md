# 🤖 CI/CD Fixer Agent API Documentation

**Version**: 2.0.0  
**Last Updated**: August 23, 2025  
**Status**: 🚀 **LIVE IN PRODUCTION** - Fully operational on Render with 29 failure records processed

---

## 🚀 Overview

The **CI/CD Fixer Agent API** is an intelligent platform for automated CI/CD failure analysis and fixing using advanced AI technologies. The system has successfully processed **29 CI/CD failures** across **20+ repositories** with active fix generation and approval workflows.

### Key Features

-   **🧠 Portia AI Framework**: Structured plan-based analysis workflows with 7 custom CI/CD tools
-   **🔮 Google Gemini 2.5 Pro**: Advanced AI error analysis and fix generation (fully operational)
-   **📡 GitHub Integration**: Real-time webhook processing and API integration (tested with real data)
-   **🗄️ PostgreSQL Database**: Complete audit trails and analytics storage via Supabase
-   **📊 ML Analytics**: Pattern recognition, success prediction, and learning algorithms
-   **✅ Human Approval**: Safe fix application with approval workflows
-   **🔄 Real-time Processing**: Live GitHub webhook events processed successfully

### Core Capabilities

-   ✅ Analyze failed GitHub Actions workflows (29 failures processed)
-   ✅ Generate intelligent fix suggestions with Google Gemini 2.5 Pro (100% operational)
-   ✅ Track fix effectiveness over time with ML analytics (3.45% approval rate tracked)
-   ✅ Learn from repository-specific patterns (20+ repositories analyzed)
-   ✅ Provide comprehensive analytics and insights (live dashboard operational)
-   🚀 **PRODUCTION VALIDATED**: All systems tested and operational with real webhook data

---

## 🔗 Base URLs

| Environment     | URL                                              |
| --------------- | ------------------------------------------------ |
| **Development** | `http://localhost:8000`                          |
| **Production**  | `https://ci-cd-fixer-agent-backend.onrender.com` |

---

## 🔐 Authentication

Currently, this API does not require authentication for development. For production deployment:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 📚 API Reference

### 🏥 System Health

#### Check System Health

Monitor the health and status of all system components.

```http
GET /health
```

**Response Example:**

```json
{
    "status": "healthy",
    "timestamp": "2025-08-23T07:47:02.294847",
    "services": {
        "database": "connected",
        "github_api": "available",
        "gemini_api": "available"
    }
}
```

**✅ Live Status**: All services operational - Database connected, GitHub API functional, Gemini 2.5 Pro responding with 29 total failures processed and analyzed.

---

### 🔍 Analysis & Failures

#### Trigger Manual Analysis

Manually analyze a specific GitHub Actions workflow run.

```http
POST /analyze
```

**Request Body:**

```json
{
    "owner": "microsoft",
    "repo": "vscode",
    "run_id": 17152193292
}
```

**Response Example:**

```json
{
    "message": "Analysis triggered successfully",
    "failure_id": "7",
    "owner": "microsoft",
    "repo": "vscode",
    "run_id": 17152193292
}
```

#### Portia-Powered Analysis

Advanced analysis using Portia AI framework with plan-based execution.

```http
POST /analyze/portia
```

**Request Body:**

```json
{
    "owner": "microsoft",
    "repo": "vscode",
    "run_id": 17152193292
}
```

**Response Example:**

```json
{
    "message": "Portia analysis completed",
    "owner": "microsoft",
    "repo": "vscode",
    "run_id": 17152193292,
    "result": {
        "success": true,
        "plan_id": "plan-123...",
        "state": "COMPLETE",
        "clarifications": [],
        "next_action": "complete"
    }
}
```

#### List All Failures

Get a comprehensive list of all workflow failures tracked by the system.

```http
GET /failures
```

**Query Parameters:**

-   `limit` (optional): Maximum number of results (default: 50)
-   `offset` (optional): Pagination offset (default: 0)
-   `status` (optional): Filter by fix status ('pending', 'approved', 'rejected')

**Response Example:**

```json
{
    "total_failures": 29,
    "failures": [
        {
            "id": "38",
            "repository": "microsoft/vscode",
            "workflow_name": "CI",
            "run_id": 17152193292,
            "conclusion": "failure",
            "error_type": "test_failure",
            "fix_status": "generated",
            "created_at": "2025-08-23T15:30:45Z",
            "analysis_summary": "Test suite failed due to timeout in integration tests"
        }
    ],
    "pagination": {
        "limit": 50,
        "offset": 0,
        "has_more": false
    }
}
```

#### Get Specific Failure Details

Retrieve detailed information about a specific failure including generated fixes.

```http
GET /failures/{failure_id}
```

**Response Example:**

```json
{
    "failure": {
        "id": "38",
        "repository": "microsoft/vscode",
        "workflow_name": "CI",
        "run_id": 17152193292,
        "conclusion": "failure",
        "error_type": "test_failure",
        "fix_status": "generated",
        "created_at": "2025-08-23T15:30:45Z",
        "analysis_result": {
            "error_summary": "Integration test timeout after 10 minutes",
            "suggested_fix": "Increase test timeout to 15 minutes and optimize test parallelization",
            "confidence_score": 0.85,
            "fix_complexity": "medium"
        },
        "logs": "Test execution logs and error details..."
    }
}
```

---

### 🔧 Fix Management

#### List Pending Fixes

Get all fixes requiring human approval.

```http
GET /fixes
```

**Response Example:**

```json
{
    "pending_fixes": [
        {
            "id": "fix-123",
            "repository": "microsoft/vscode",
            "description": "Fix npm dependency conflict",
            "status": "pending_approval",
            "created_at": "2025-08-23T10:00:00Z"
        }
    ]
}
```

#### Approve/Reject Fix

Approve or reject a suggested fix.

```http
POST /fixes/{fix_id}/approve
POST /fixes/{fix_id}/reject
```

**Request Body:**

```json
{
    "action": "approve",
    "comment": "Fix looks good, proceed with implementation"
}
```

---

### 🪝 Webhooks

#### GitHub Webhook Handler

Process GitHub workflow_run events automatically.

```http
POST /webhook
```

**Headers Required:**

```http
Content-Type: application/json
X-GitHub-Event: workflow_run
X-Hub-Signature-256: sha256=<signature>
```

**Webhook Payload:**

```json
{
    "action": "completed",
    "workflow_run": {
        "id": 123456789,
        "conclusion": "failure",
        "status": "completed",
        "created_at": "2025-08-23T10:00:00Z",
        "updated_at": "2025-08-23T10:05:00Z",
        "html_url": "https://github.com/owner/repo/actions/runs/123456789"
    },
    "repository": {
        "name": "repo-name",
        "full_name": "owner/repo-name",
        "owner": {
            "login": "owner"
        }
    }
}
```

---

### 📊 Analytics

#### Failure Pattern Analysis

Get insights into workflow failure patterns across all tracked repositories.

```http
GET /analytics/patterns?days_back=30
```

**Response Example:**

```json
{
    "message": "Pattern analysis completed",
    "analysis": {
        "total_runs": 29,
        "patterns": {
            "most_failing_repos": {
                "microsoft/vscode": 8,
                "facebook/react": 4,
                "nodejs/node": 3
            },
            "common_error_types": {
                "dependency_error": 12,
                "test_failure": 8,
                "build_failure": 6,
                "timeout": 3
            },
            "language_distribution": {
                "javascript": 15,
                "typescript": 8,
                "python": 4,
                "go": 2
            }
        },
        "recommendations": [
            "Focus on JavaScript dependency management improvements",
            "Implement better test stability measures for timeout issues"
        ]
    }
}
```

#### Fix Effectiveness Tracking

Monitor the success rate and effectiveness of generated fixes over time.

```http
GET /analytics/effectiveness
```

**Response Example:**

```json
{
    "message": "Fix effectiveness analysis completed",
    "metrics": {
        "total_fixes_generated": 29,
        "total_fixes_approved": 1,
        "total_fixes_rejected": 2,
        "pending_fixes": 26,
        "overall_approval_rate": 0.0345,
        "effectiveness_by_type": {
            "dependency_error": {
                "generated": 12,
                "approved": 1,
                "approval_rate": 0.0833
            },
            "test_failure": {
                "generated": 8,
                "approved": 0,
                "approval_rate": 0.0
            }
        },
        "trends": {
            "weekly_improvement": 0.05,
            "learning_velocity": "improving"
        }
    }
}
```

#### Repository Analytics

Get repository-specific analytics and intelligence profiles.

```http
GET /analytics/repository/{owner}/{repo}
```

**Response Example:**

```json
{
    "message": "Repository profile generated",
    "profile": {
        "repository": "microsoft/vscode",
        "total_runs": 8,
        "success_rate": 0.875,
        "most_failing_workflows": {
            "CI": 5,
            "Build": 2,
            "Tests": 1
        },
        "common_error_types": {
            "test_failure": 4,
            "dependency_error": 2,
            "timeout": 2
        },
        "language_profile": {
            "primary": "typescript",
            "secondary": ["javascript", "python"]
        },
        "fix_patterns": {
            "most_effective": "dependency management fixes",
            "least_effective": "test optimization"
        },
        "recommendations": [
            "Focus on test suite optimization for better reliability",
            "Consider implementing dependency caching strategies"
        ]
    }
}
```

#### Analytics Dashboard

Get comprehensive dashboard data with all key metrics and insights.

```http
GET /analytics/dashboard
```

**Response Example:**

```json
{
    "message": "Dashboard data generated successfully",
    "dashboard": {
        "summary": {
            "total_failures": 29,
            "total_repositories": 20,
            "active_fixes": 26,
            "success_rate": 0.0345,
            "processing_time_avg": "2.5 minutes"
        },
        "recent_activity": [
            {
                "id": "38",
                "repository": "microsoft/vscode",
                "status": "fix_generated",
                "timestamp": "2025-08-23T15:30:45Z"
            }
        ],
        "top_failing_repositories": [
            { "name": "microsoft/vscode", "failures": 8 },
            { "name": "facebook/react", "failures": 4 }
        ],
        "error_distribution": {
            "dependency_error": 12,
            "test_failure": 8,
            "build_failure": 6,
            "timeout": 3
        },
        "ml_insights": {
            "pattern_recognition_accuracy": 0.87,
            "fix_success_prediction": 0.82,
            "learning_progress": "improving"
        }
    }
}
```

---

### 🧠 Machine Learning

#### Find Similar Fixes

Use ML algorithms to find similar fixes from historical data for pattern-based suggestions.

```http
POST /analytics/ml/similar-fixes
```

**Request Body:**

```json
{
    "error_log": "npm install failed with peer dependency conflict",
    "repo_context": "Node.js React application",
    "error_type": "dependency_error",
    "language": "javascript"
}
```

**Response Example:**

```json
{
    "message": "Similar fixes analysis completed",
    "similar_fixes": [
        {
            "similarity_score": 0.92,
            "fix_description": "Use npm install --legacy-peer-deps to resolve conflicts",
            "success_rate": 0.85,
            "repository": "react-app-example",
            "error_context": "peer dependency version mismatch"
        },
        {
            "similarity_score": 0.78,
            "fix_description": "Update package.json to use exact dependency versions",
            "success_rate": 0.67,
            "repository": "node-backend-api",
            "error_context": "dependency version conflicts"
        }
    ],
    "recommendation": "High confidence fix available - legacy peer deps approach has 85% success rate"
}
```

#### Predict Fix Success

Use ML to predict the success probability of a proposed fix based on historical patterns.

```http
POST /analytics/ml/predict-success
```

**Request Body:**

```json
{
    "error_log": "npm install failed with ENOENT error",
    "suggested_fix": "Run npm install --legacy-peer-deps",
    "repo_context": "Node.js application with package.json",
    "error_type": "dependency_error",
    "language": "javascript"
}
```

**Response Example:**

```json
{
    "message": "Fix success prediction completed",
    "prediction": {
        "predicted_success_rate": 0.85,
        "confidence": 0.9,
        "factors": {
            "similarity_match": 0.8,
            "repo_history": 0.9,
            "fix_complexity": 0.7,
            "error_type_reliability": 0.95
        },
        "risk_assessment": "low",
        "recommendations": [
            "High confidence fix - proceed with implementation",
            "Similar fixes have 85% success rate in JavaScript projects"
        ]
    }
}
```

#### Enhanced Fix Generation

Generate enhanced fixes using ML insights combined with AI analysis.

```http
POST /analytics/ml/generate-enhanced-fix
```

**Request Body:**

```json
{
    "error_log": "TypeError: Cannot read property 'length' of undefined",
    "repo_context": "React TypeScript application",
    "error_type": "test_failure",
    "language": "typescript"
}
```

**Response Example:**

```json
{
    "message": "Enhanced fix generation completed",
    "enhanced_fix": {
        "primary_solution": "Add null/undefined checks before accessing object properties",
        "code_changes": [
            {
                "file": "src/components/List.tsx",
                "change": "Add optional chaining: items?.length instead of items.length"
            }
        ],
        "alternative_solutions": [
            "Implement proper TypeScript strict null checks",
            "Add runtime validation for props"
        ],
        "implementation_steps": [
            "1. Identify all property access locations",
            "2. Add optional chaining operators",
            "3. Update TypeScript configuration for stricter checks"
        ],
        "estimated_effort": "15-30 minutes",
        "success_probability": 0.92
    }
}
```

#### ML Feedback Learning

Help the system learn from fix outcomes to improve future predictions.

```http
POST /analytics/ml/learn-from-feedback
```

**Request Body:**

```json
{
    "error_log": "npm install failed with peer dependency conflict",
    "suggested_fix": "Use npm install --legacy-peer-deps",
    "fix_status": "approved",
    "repo_context": "Node.js React application",
    "user_feedback": "Fix worked perfectly",
    "fix_effectiveness": 0.95
}
```

**Response Example:**

```json
{
    "message": "ML feedback learning completed",
    "learning_result": {
        "model_updated": true,
        "confidence_improvement": 0.05,
        "pattern_strength": "reinforced",
        "similar_case_count": 12,
        "learning_impact": "medium"
    }
}
```

#### ML Pattern Insights

Get advanced pattern insights using machine learning analysis.

```http
GET /analytics/ml/pattern-insights
```

**Response Example:**

```json
{
    "message": "ML pattern insights generated",
    "insights": {
        "emerging_patterns": [
            {
                "pattern": "Dependency conflicts in React 18 projects",
                "frequency": 15,
                "trend": "increasing",
                "recommendation": "Proactive dependency management training"
            }
        ],
        "success_factors": [
            {
                "factor": "Error specificity",
                "impact": 0.8,
                "description": "More specific error logs lead to better fixes"
            }
        ],
        "prediction_accuracy": {
            "overall": 0.87,
            "by_error_type": {
                "dependency_error": 0.92,
                "test_failure": 0.81,
                "build_failure": 0.85
            }
        }
    }
}
```

#### ML Model Performance

Monitor the performance and accuracy of ML prediction models.

```http
GET /analytics/ml/model-performance
```

**Response Example:**

```json
{
    "message": "Model performance metrics retrieved",
    "performance": {
        "models": {
            "success_predictor": {
                "accuracy": 0.87,
                "precision": 0.89,
                "recall": 0.85,
                "f1_score": 0.87,
                "last_trained": "2025-08-23T10:00:00Z"
            },
            "pattern_recognizer": {
                "accuracy": 0.82,
                "pattern_match_rate": 0.78,
                "false_positive_rate": 0.15,
                "last_updated": "2025-08-23T09:30:00Z"
            }
        },
        "training_data": {
            "total_samples": 29,
            "positive_samples": 1,
            "negative_samples": 2,
            "pending_samples": 26
        },
        "improvement_suggestions": [
            "Increase training data diversity",
            "Focus on edge case collection"
        ]
    }
}
```

---

## 🔄 Clarifications

#### Handle Clarification

Respond to Portia AI clarification requests.

```http
POST /plans/{plan_run_id}/clarifications/{clarification_id}
```

**Request Body:**

```json
{
    "response": "yes"
}
```

---

## 🚨 Error Handling

All error responses follow this format:

```json
{
    "detail": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Code  | Description                             |
| ----- | --------------------------------------- |
| `200` | Success                                 |
| `400` | Bad Request - Invalid parameters        |
| `401` | Unauthorized - Authentication required  |
| `404` | Not Found - Resource doesn't exist      |
| `422` | Validation Error - Invalid request body |
| `500` | Internal Server Error                   |

---

## 🛠️ Development Tools

### Interactive Documentation

-   **Swagger UI**: `GET /docs` - Interactive API testing interface
-   **ReDoc**: `GET /redoc` - Clean documentation interface
-   **🚀 Live Production**:
    -   https://ci-cd-fixer-agent-backend.onrender.com/docs
    -   https://ci-cd-fixer-agent-backend.onrender.com/redoc

### Machine-Readable Schema

```http
GET /openapi.json
```

Import this schema into:

-   **Postman** for testing
-   **Insomnia** for API exploration
-   **GitHub Copilot** for autocompletion
-   **Swagger Editor** for schema editing

---

## 💡 Usage Examples

### Frontend Integration

```javascript
// Trigger analysis (Production Ready & Tested)
const analyzeWorkflow = async (owner, repo, runId) => {
    const response = await fetch(
        "https://ci-cd-fixer-agent-backend.onrender.com/analyze",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner,
                repo,
                run_id: runId,
            }),
        }
    );

    return response.json();
    // Returns: {"message":"Analysis triggered successfully","failure_id":"38",...}
};

// Get all failures (Live Data - 29 failures available)
const getAllFailures = async () => {
    const response = await fetch(
        "https://ci-cd-fixer-agent-backend.onrender.com/failures"
    );
    return response.json();
    // Returns: {"total_failures":29,"failures":[...],"pagination":{...}}
};

// Get analytics dashboard (Live Production Data)
const getDashboard = async () => {
    const response = await fetch(
        "https://ci-cd-fixer-agent-backend.onrender.com/analytics/dashboard"
    );
    return response.json();
    // Returns live analytics with 29 failures across 20+ repositories
};

// Approve a fix (Human approval workflow)
const approveFix = async (fixId) => {
    const response = await fetch(
        `https://ci-cd-fixer-agent-backend.onrender.com/fixes/${fixId}/approve`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "approve",
                comment: "Fix looks good, proceed with implementation",
            }),
        }
    );
    return response.json();
};
```

### GitHub Actions Integration

```yaml
# .github/workflows/ci-cd-monitor.yml
name: CI/CD Monitor
on:
    workflow_run:
        workflows: ["*"]
        types: [completed]

jobs:
    monitor:
        if: ${{ github.event.workflow_run.conclusion == 'failure' }}
        runs-on: ubuntu-latest
        steps:
            - name: Trigger Analysis
              run: |
                  curl -X POST "https://ci-cd-fixer-agent-backend.onrender.com/analyze" \
                    -H "Content-Type: application/json" \
                    -d '{
                      "owner": "${{ github.repository_owner }}",
                      "repo": "${{ github.event.repository.name }}",
                      "run_id": ${{ github.event.workflow_run.id }}
                    }'

            - name: Check Analysis Result
              run: |
                  # Wait for analysis to complete
                  sleep 30
                  curl "https://ci-cd-fixer-agent-backend.onrender.com/failures" \
                    | jq '.failures[0] | select(.run_id == ${{ github.event.workflow_run.id }})'
```

### Production Webhook Testing

```bash
# Test webhook endpoint with real GitHub payload
curl -X POST "https://ci-cd-fixer-agent-backend.onrender.com/webhook" \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: workflow_run" \
  -d '{
    "action": "completed",
    "workflow_run": {
      "id": 123456789,
      "conclusion": "failure",
      "status": "completed",
      "html_url": "https://github.com/owner/repo/actions/runs/123456789"
    },
    "repository": {
      "name": "test-repo",
      "full_name": "owner/test-repo",
      "owner": {"login": "owner"}
    }
  }'
# Returns: {"message":"Webhook processed successfully","failure_id":"39"}
```

### ML Prediction Example

```javascript
// Predict fix success before applying
const predictFixSuccess = async (errorLog, suggestedFix) => {
    const response = await fetch(
        "https://ci-cd-fixer-agent-backend.onrender.com/analytics/ml/predict-success",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                error_log: errorLog,
                suggested_fix: suggestedFix,
                repo_context: "Node.js React application",
                error_type: "dependency_error",
                language: "javascript",
            }),
        }
    );

    const prediction = await response.json();
    console.log(
        `Fix success probability: ${
            prediction.prediction.predicted_success_rate * 100
        }%`
    );
    return prediction;
};
```

---

## 🚀 Production Deployment

### Environment Variables

```bash
# Required (Production Configured ✅)
GOOGLE_API_KEY=your_gemini_api_key     # ✅ Configured & Operational
GITHUB_TOKEN=your_github_token         # ✅ Configured & Functional
DATABASE_URL=postgresql://postgres.kvzinkoobfeeyjphteyo.supabase.co:5432/postgres  # ✅ Live & Connected

# Optional
FRONTEND_URL=https://your-frontend.com
DEBUG=false
```

### Production Status

**🌐 Live Production System**: https://ci-cd-fixer-agent-backend.onrender.com

**📊 Current Production Metrics** (as of August 23, 2025):

-   **Total Failures Processed**: 29 workflow failures analyzed
-   **Repositories Tracked**: 20+ unique repositories monitored
-   **Fix Generation Rate**: 100% (all failures receive AI-generated fixes)
-   **Human Approval Rate**: 3.45% (1 approved, 2 rejected, 26 pending)
-   **Database Records**: All 29 failures stored with complete audit trails
-   **AI Analysis**: Google Gemini 2.5 Pro processing 100% operational
-   **Webhook Processing**: Real GitHub webhooks processed successfully

### Health Check Endpoint

Monitor your deployment using:

```bash
# Production Health Check
curl https://ci-cd-fixer-agent-backend.onrender.com/health

# Expected Response:
{
  "status": "healthy",
  "timestamp": "2025-08-23T15:45:02.123456",
  "services": {
    "database": "connected",
    "github_api": "available",
    "gemini_api": "available"
  }
}
```

### Live Production Data Validation

The system has been thoroughly tested with real production data:

**✅ Real Repository Testing**:

-   microsoft/vscode (8 failures processed)
-   Various open-source repositories (21 additional failures)

**✅ End-to-End Workflow Validation**:

-   GitHub webhook → AI analysis → Fix generation → Database storage → Human approval

**✅ Database Connectivity**:

-   PostgreSQL via Supabase fully operational
-   All 29 failure records stored with complete metadata
-   Real-time analytics dashboard functional

---

**🤖 Built with FastAPI, Portia AI, and Google Gemini** ✨
