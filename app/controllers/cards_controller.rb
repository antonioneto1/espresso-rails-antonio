# frozen_string_literal: true

class CardsController < ApplicationController
  before_action :authenticate_user!

  def new
    authorize Card
  end

  def create
    @card = ::Cards::Build.new(params[:user_id], card_params).execute

    authorize @card

    if @card.save
      render json: { message: 'Card was successfully created.' },  status: :created
    else
      render json: { errors: @card.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def card_params
    params.require(:card).permit(:last4)
  end
end
