# frozen_string_literal: true

class Statement < ApplicationRecord
  belongs_to :category, optional: true
  belongs_to :card

  has_one :company, through: :card
  has_one_attached :invoice

  validates :cost, :merchant, :performed_at, :transaction_id, presence: true

  scope :completed, -> { has_invoice.has_category }
  scope :open, -> { missing_invoice.or(missing_category.left_joins(:invoice_attachment)) }

  scope :has_category, -> { where.not(category_id: nil) }
  scope :has_invoice, -> { left_joins(:invoice_attachment).where.not(active_storage_attachments: { id: nil }) }
  scope :missing_invoice, -> { left_joins(:invoice_attachment).where(active_storage_attachments: { id: nil }) }
  scope :missing_category, -> { where(category_id: nil) }  

  default_scope { order(performed_at: :desc) }

  def statement_map
    {
      id: id,
      cost: cost.to_f,
      merchant: merchant,
      performed_at: performed_at.to_datetime&.strftime('%d/%m/%Y %H:%M'),
      transaction_id: transaction_id,
      category_id: category&.name,
      # status: completed ? 'Comprovada' : 'Não Comprovada'
    }
  end
end
