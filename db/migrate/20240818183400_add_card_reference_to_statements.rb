
class AddCardReferenceToStatements < ActiveRecord::Migration[5.2]
  def change
    add_reference :statements, :card, foreign_key: true
  end
end
