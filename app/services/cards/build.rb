# frozen_string_literal: true

module Cards
  class Build
    def initialize(card_params)
      @card_params = card_params
    end

    def execute
      Card.new(card_params)
    end

    private

    attr_reader :card_params
  end
end
