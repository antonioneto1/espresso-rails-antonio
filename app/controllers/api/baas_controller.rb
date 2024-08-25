# frozen_string_literal: true

module Api
  class BaasController < ApplicationController
    skip_after_action :verify_authorized
    skip_forgery_protection

    def webhook
      @statement = ::Statements::Build.new(statement_params).execute

      if @statement.save
        render json: { message: 'Statement was successfully created.' }, status: :created
      else
        render json: { errors: @statement.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def statement_params
      params.permit(
        :merchant,
        :cost,
        :created_at,
        :last4,
        :transaction_id
      ).merge(card: Card.find_by!(last4: params[:last4]))
    end
  end
end
