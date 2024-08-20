# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    name { Faker::Music.genre }
    company
  end
end
