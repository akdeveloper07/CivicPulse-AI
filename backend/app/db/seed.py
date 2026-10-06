import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.entities import (
    User, IssueCategory, Report, ReportEmbedding, IssueCluster, ReportMatch,
    RecurrenceEvent, RootCauseHypothesis, ModelEvaluation
)
from app.core.security import get_password_hash
from app.ai.embeddings import generate_embedding, get_text_fingerprint
from app.ai.priority import calculate_transparent_priority_score

logger = logging.getLogger("civicpulse.seed")


def seed_database():
    """Seed synthetic civic reports, categories, demo users, and AI records."""
    # Ensure database schema is created
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Create Default Categories
        categories_data = [
            ("Potholes & Damaged Roads", "Surface craters, asphalt cracks, damaged road surfaces, broken pavements."),
            ("Waterlogging & Drainage", "Blocked storm drains, waterlogging, standing water after rains, drainage overflow."),
            ("Water Leakage & Supply", "Underground pipe bursts, clean water leakage, low pressure, broken supply lines."),
            ("Streetlight & Lighting", "Flickering street lamps, dead lights, broken posts, dark pedestrian walkways."),
            ("Garbage & Solid Waste", "Uncollected trash bins, dumped solid waste, littering, public bin overflow."),
            ("Public Infrastructure", "Damaged bus stops, broken park benches, cracked boundary walls, hazardous signs.")
        ]

        category_map = {}
        for cat_name, cat_desc in categories_data:
            existing_cat = db.query(IssueCategory).filter(IssueCategory.name == cat_name).first()
            if not existing_cat:
                cat = IssueCategory(name=cat_name, description=cat_desc)
                db.add(cat)
                db.flush()
                category_map[cat_name] = cat.id
            else:
                category_map[cat_name] = existing_cat.id

        # 2. Create Demo Accounts
        users_data = [
            ("Citizen User", "citizen@civicpulse.org", "CitizenPass123!", "citizen"),
            ("Municipal Administrator", "admin@civicpulse.org", "AdminPass123!", "administrator"),
            ("System Admin", "sysadmin@civicpulse.org", "SysAdminPass123!", "system_admin")
        ]

        user_map = {}
        for name, email, password, role in users_data:
            existing_user = db.query(User).filter(User.email == email).first()
            if not existing_user:
                usr = User(
                    name=name,
                    email=email,
                    password_hash=get_password_hash(password),
                    role=role
                )
                db.add(usr)
                db.flush()
                user_map[email] = usr.id
            else:
                user_map[email] = existing_user.id

        citizen_id = user_map["citizen@civicpulse.org"]
        admin_id = user_map["admin@civicpulse.org"]

        # 3. Create Synthetic Reports & Clusters
        if db.query(Report).count() > 0:
            logger.info("Database already seeded with demo data.")
            return

        now = datetime.now(timezone.utc)

        # Cluster 1: Pothole Group (3 duplicate reports)
        c1_title = "[Demo] Hazardous Pothole near MG Road Junction"
        c1_desc = "Dangerous deep crater on MG Road near the main bus stop causing vehicle swerving and heavy traffic delays."
        score1, _, _, _ = calculate_transparent_priority_score(9, 8, 1, 3, now - timedelta(days=5))
        
        cluster1 = IssueCluster(
            representative_title=c1_title,
            representative_description=c1_desc,
            category_id=category_map["Potholes & Damaged Roads"],
            status="In Progress",
            current_priority_score=score1,
            recurrence_count=1
        )
        db.add(cluster1)
        db.flush()

        r1_1 = Report(
            submitter_id=citizen_id,
            category_id=category_map["Potholes & Damaged Roads"],
            cluster_id=cluster1.id,
            title="[Demo] Deep crater in road asphalt at MG Road",
            description="Large pothole has formed right in front of MG Road city bus station. Vehicles are suddenly braking.",
            impact=9, urgency=8, approximate_area="MG Road", status="In Progress",
            created_at=now - timedelta(days=5)
        )
        r1_2 = Report(
            submitter_id=citizen_id,
            category_id=category_map["Potholes & Damaged Roads"],
            cluster_id=cluster1.id,
            title="[Demo] Huge pothole causing traffic jam near MG bus stop",
            description="Massive hole in the tarmac near MG Road junction. Cars trying to avoid it are creating a bottleneck.",
            impact=8, urgency=7, approximate_area="MG Road", status="In Progress",
            created_at=now - timedelta(days=4)
        )
        r1_3 = Report(
            submitter_id=citizen_id,
            category_id=category_map["Potholes & Damaged Roads"],
            cluster_id=cluster1.id,
            title="[Demo] Broken pavement crater MG Road",
            description="Damaged road surface crater on MG Road. Dangerous for two-wheelers at night.",
            impact=8, urgency=8, approximate_area="MG Road", status="In Progress",
            created_at=now - timedelta(days=3)
        )
        db.add_all([r1_1, r1_2, r1_3])
        db.flush()

        # Cluster 2: Blocked Drain & Waterlogging (2 related reports)
        c2_title = "[Demo] Storm Drain Blockage on 4th Avenue"
        c2_desc = "Main storm drain completely clogged with plastic bottles and silt, causing waterlogging during rain."
        score2, _, _, _ = calculate_transparent_priority_score(8, 9, 0, 2, now - timedelta(days=2))
        
        cluster2 = IssueCluster(
            representative_title=c2_title,
            representative_description=c2_desc,
            category_id=category_map["Waterlogging & Drainage"],
            status="Under Review",
            current_priority_score=score2,
            recurrence_count=0
        )
        db.add(cluster2)
        db.flush()

        r2_1 = Report(
            submitter_id=citizen_id,
            category_id=category_map["Waterlogging & Drainage"],
            cluster_id=cluster2.id,
            title="[Demo] Clogged drain grate on 4th Avenue",
            description="Debris and plastic waste clogging the drainage inlet on 4th Avenue.",
            impact=8, urgency=9, approximate_area="4th Avenue", status="Under Review",
            created_at=now - timedelta(days=2)
        )
        r2_2 = Report(
            submitter_id=citizen_id,
            category_id=category_map["Waterlogging & Drainage"],
            cluster_id=cluster2.id,
            title="[Demo] Knee-deep standing water logging after light rain",
            description="Severe waterlogging on 4th Avenue street after 20 minutes of rain because drains are blocked.",
            impact=9, urgency=9, approximate_area="4th Avenue", status="Under Review",
            created_at=now - timedelta(days=1)
        )
        db.add_all([r2_1, r2_2])
        db.flush()

        # Cluster 3: Resolved Cluster (for Recurrence demonstration)
        c3_title = "[Demo] Water Leakage at Central Market Square"
        c3_desc = "Water pipe leak leaking clean water continuously onto pavement near Central Market."
        score3, _, _, _ = calculate_transparent_priority_score(7, 6, 0, 1, now - timedelta(days=15))

        cluster3 = IssueCluster(
            representative_title=c3_title,
            representative_description=c3_desc,
            category_id=category_map["Water Leakage & Supply"],
            status="Resolved",
            current_priority_score=score3,
            recurrence_count=0,
            resolved_at=now - timedelta(days=8)
        )
        db.add(cluster3)
        db.flush()

        r3_1 = Report(
            submitter_id=citizen_id,
            category_id=category_map["Water Leakage & Supply"],
            cluster_id=cluster3.id,
            title="[Demo] Water pipe leak at Central Market",
            description="Underground water line leaking near shop entrance.",
            impact=7, urgency=6, approximate_area="Central Market", status="Resolved",
            created_at=now - timedelta(days=15), resolved_at=now - timedelta(days=8)
        )
        db.add(r3_1)
        db.flush()

        # Generate Embeddings for seeded reports
        for r in [r1_1, r1_2, r1_3, r2_1, r2_2, r3_1]:
            full_text = f"{r.title}. {r.description}"
            vec, m_ver = generate_embedding(full_text)
            emb = ReportEmbedding(
                report_id=r.id,
                model_name="SentenceTransformers",
                model_version=m_ver,
                embedding_json={"vector": vec},
                text_fingerprint=get_text_fingerprint(full_text)
            )
            db.add(emb)

        # Add Match Suggestions
        match1 = ReportMatch(
            source_report_id=r1_2.id,
            candidate_report_id=r1_1.id,
            similarity_score=0.895,
            match_type="semantic",
            decision="Confirmed duplicate",
            decision_reason="Identical pothole complaint at MG Road junction.",
            reviewer_id=admin_id,
            model_version="1.0.0",
            reviewed_at=now - timedelta(days=3)
        )
        match2 = ReportMatch(
            source_report_id=r1_3.id,
            candidate_report_id=r1_1.id,
            similarity_score=0.842,
            match_type="semantic",
            decision="Suggested",
            decision_reason="High semantic match score near threshold.",
            model_version="1.0.0"
        )
        db.add_all([match1, match2])

        # Add Recurrence Event
        rec_event = RecurrenceEvent(
            historical_cluster_id=cluster3.id,
            new_report_id=r1_1.id,
            similarity_score=0.74,
            evidence="Re-reported leak near Central Market following resolution 8 days ago.",
            status="Pending Review"
        )
        db.add(rec_event)

        # Add Root Cause Hypothesis
        hypothesis = RootCauseHypothesis(
            source_cluster_id=cluster2.id,
            related_cluster_id=cluster1.id,
            hypothesis_text="[Demo] Drainage blockage on 4th Avenue is causing street water accumulation that degrades MG Road pavement.",
            evidence_json={
                "domain_heuristic": "Blocked storm drains lead to standing water which erodes asphalt sub-bases.",
                "same_area": False,
                "semantic_similarity": 0.58
            },
            score_or_strength=0.78,
            uncertainty_label="Low Uncertainty",
            review_status="Proposed"
        )
        db.add(hypothesis)

        # Add Model Evaluation Record
        eval_record = ModelEvaluation(
            model_name="SentenceTransformers (all-MiniLM-L6-v2)",
            model_version="1.0.0",
            evaluation_type="semantic_matching",
            dataset_version="v1.0-seed",
            metrics_json={
                "precision": 0.923,
                "recall": 0.889,
                "f1_score": 0.905,
                "baseline_f1": 0.706,
                "improvement": "+19.9%"
            }
        )
        db.add(eval_record)

        db.commit()
        logger.info("Successfully seeded database with synthetic civic reports and demo accounts.")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
