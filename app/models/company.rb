# frozen_string_literal: true

class Company < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :cards, dependent: :destroy
  has_many :statements, dependent: :destroy

  validates :name, presence: true
  validates :cnpj, format: /\A\d{14}\z/, uniqueness: true, presence: true
end
