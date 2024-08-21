# frozen_string_literal: true

module Categories
  class Build
    def initialize(company_id, category_params)
      @company = Company.find(company_id)
      @category_params = category_params
    end

    def execute
      Category.new(category_params.merge(company: company))
    end

    private

    attr_reader :company, :category_params
  end
end
