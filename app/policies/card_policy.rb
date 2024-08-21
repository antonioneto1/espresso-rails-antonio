class CardPolicy < ApplicationPolicy

  def index?
    user.admin?
  end

  def create?
    user.admin?
  end

  def update?
    user.admin?
  end

  def destroy?
    user.admin?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if user.admin?
        Card.joins(:user).where(users: { company_id: user.company_id })
      else
        Card.where(user_id: user.id)
      end
    end
  end
end
