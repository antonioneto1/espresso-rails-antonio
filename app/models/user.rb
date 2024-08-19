class User < ApplicationRecord
  belongs_to :company
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_secure_password

  enum role: { employee: 0, admin: 1 }

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :password, presence: true, on: :create
end
