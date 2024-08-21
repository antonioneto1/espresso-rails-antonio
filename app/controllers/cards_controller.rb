class CardsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_company
  before_action :set_card, only: [:show, :update, :destroy]
  before_action :authorize_card, only: [:update, :destroy]

  def index
    @cards = policy_scope(Card)
    authorize @cards
    byebug
    render json: { cards: @cards.map(&:card_map) }
  end

  def create
    @card = ::Cards::Build.new(card_params).execute
    authorize @card

    if @card.save
      render json: { message: 'Card was successfully created.' }, status: :created
    else
      render json: { errors: @card.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_company
    @company = Company.find(params[:company_id])
  end

  def set_card
    @card = Card.find(params[:id])
  end

  def authorize_card
    authorize @card
  end

  def card_params
    params.require(:card).permit(:last4, :user_id)
  end
end
