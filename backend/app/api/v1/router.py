from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, reports, matching, clusters, recurrence, root_causes, recommendations, forecasting, analytics, admin, health
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(matching.router, prefix="/ai", tags=["AI Matching & Review Queue"])
api_router.include_router(clusters.router, prefix="/clusters", tags=["Issue Clusters"])
api_router.include_router(recurrence.router, prefix="/recurrence", tags=["Recurrence Detection"])
api_router.include_router(root_causes.router, prefix="/root-causes", tags=["AI Root Cause Discovery"])
api_router.include_router(recommendations.router, prefix="", tags=["Resolution Recommendations"])
api_router.include_router(forecasting.router, prefix="/analytics", tags=["Issue Volume Forecasting"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & Fairness"])
api_router.include_router(admin.router, prefix="/admin", tags=["System Administration"])
api_router.include_router(health.router, tags=["Health & Status"])
