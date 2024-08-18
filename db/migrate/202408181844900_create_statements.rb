# frozen_string_literal: true

class CreateStatements < ActiveRecord::Migration[5.2]
  def change
    create_table :statements do |t|
      t.datetime :performed_at, null: false
      t.integer :cost, null: false
      t.string :merchant, null: false
      t.string :transaction_id, uniqueness: true, null: false
      t.references :category, foreign_key: true

      t.timestamps
    end
  end
end
