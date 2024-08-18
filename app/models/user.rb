class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  belongs_to :company
  has_one :card

  enum role: { admin: 0, employee: 1 }

  validates :name, presence: true
  validates :role, presence: true
end
