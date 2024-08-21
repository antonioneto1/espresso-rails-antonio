# frozen_string_literal: true

module Statements
  class Build
    def initialize(statement_params)
      @card = Card.find_by(last4: statement_params[:last4])
      @statement_params = statement_params.except(:last4, :created_at)
      @statement_params[:performed_at] = Time.zone.parse(statement_params[:created_at])
    end

    def execute
      Statement.new(statement_params.merge(card: card))
    end

    private

    attr_reader :card, :statement_params
  end
end
