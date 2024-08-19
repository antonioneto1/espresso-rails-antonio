# frozen_string_literal: true

class StatementsController < ApplicationController
  before_action :authenticate_user!

  def index
    @completed_statements = policy_scope(Statement.completed)
    @open_statements = policy_scope(Statement.open)

    authorize Statement
  end

  def edit
    @statement = Statement.find(params[:id])
    @categories = Category.where(company_id: current_user.company_id)

    authorize @statement
  end

  def update
    @statement = Statement.find(params[:id])

    authorize @statement

    if @statement.update(permitted_attributes(@statement))
      render json: { message: 'Statement was updated' }
    else
      render json: { errors: @statement.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def attach_invoice
    @statement = Statement.find(params[:statement_id])

    authorize @statement

    @statement.invoice.attach(attach_invoice_params[:file])

    if @statement.reload.invoice.attached?
      render json: { message: 'Statement was archived!' }
    else
      render json: { errors: @statement.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def attach_invoice_params
    params.permit(:file)
  end
end
