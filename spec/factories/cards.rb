# frozen_string_literal: true

FactoryBot.define do
  factory :card do
    user
    company
    last4 { Faker::Number.number(digits: 4) }
  end
end