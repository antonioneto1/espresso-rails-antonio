class Company < ApplicationRecord
  has_many :users
  has_many :cards
  has_many :categories
end
