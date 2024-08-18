# frozen_string_literal: true

class AddUniqueIndexToCategory < ActiveRecord::Migration[5.2]
  def change
    add_index :categories, %i[company_id name], unique: true
  end
end
