class AddDetailsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :name, :string, null: false
    add_column :users, :role, :integer, null: false, default: 1
    add_reference :users, :company, foreign_key: true, null: false
  end
end
