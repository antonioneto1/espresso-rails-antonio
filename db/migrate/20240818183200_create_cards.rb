# frozen_string_literal: true

class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
      t.references :user, foreign_key: true, index: { unique: true }
      t.string :last4, null: false
    end
  end
end
