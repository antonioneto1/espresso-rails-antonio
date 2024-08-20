class User < ApplicationRecord
  belongs_to :company
  devise :database_authenticatable, :recoverable, :rememberable, :validatable

  enum role: { employee: 0, admin: 1 }

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  before_validation :set_password, on: :create

  private

  def set_password
    self.password ||= SecureRandom.hex(8)
  end
end
