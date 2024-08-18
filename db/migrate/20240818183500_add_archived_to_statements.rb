# frozen_string_literal: true

class AddArchivedToStatements < ActiveRecord::Migration[5.2]
  def change
    add_column :statements, :archived, :boolean, default: false, null: false
  end
end
