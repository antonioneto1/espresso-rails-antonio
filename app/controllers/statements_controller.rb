# frozen_string_literal: true

class StatementsController < ApplicationController
  before_action :authenticate_user!
  after_action :verify_authorized, except: [:index]

  def index
    if current_user.admin?
      @completed_statements = policy_scope(Statement.completed)
      @open_statements = policy_scope(Statement.open)

      render json: {
        completed_statements: @completed_statements.map(&:statement_map),
        open_statements: @open_statements.map(&:statement_map)
      }
    else
      @user_statements = policy_scope(Statement)
      render json: {
        statements: @user_statements.map(&:statement_map)
      }
    end
  end

  def edit
    @statement = Statement.find(params[:id])
    @categories = Category.where(company_id: current_user.company_id)

    authorize @statement
  end

  def update
    @statement = Statement.find(params[:id])

    authorize @statement
    if @statement.update(statement_update_params) && @statement.invoice.attach(attach_invoice_params[:file])
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

  def statement_update_params
    params.permit(:category_id, :archived)
  end

  def attach_invoice_params
    params.permit(:file)
  end
end
