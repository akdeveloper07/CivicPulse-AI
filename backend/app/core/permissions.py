from enum import Enum


class UserRole(str, Enum):
    CITIZEN = "citizen"
    ADMINISTRATOR = "administrator"
    SYSTEM_ADMIN = "system_admin"


def check_has_role(user_role: str, allowed_roles: list[UserRole]) -> bool:
    """Check if the user's role is in the list of allowed roles."""
    return user_role in [role.value for role in allowed_roles]
