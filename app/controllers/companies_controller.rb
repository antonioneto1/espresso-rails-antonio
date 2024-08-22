# frozen_string_literal: true

class CompaniesController < ApplicationController
  before_action :authenticate_user! , except: %i[index show]

  def index
  end

  def new
    authorize Company
  end

  def create
    @company = Company.new(company_params)

    authorize @company

    if @company.save
      render json: { message: 'Company was successfully created.' }, status: :created
    else
      render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def company_params
    params.require(:company).permit(:name, :cnpj)
  end
end
