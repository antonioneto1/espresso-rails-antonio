# config/routes.rb
Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: 'registrations' }

  as :user do
    get 'users/sign_up', to: 'registrations#new', as: :new_user_registration
    post 'users', to: 'registrations#create', as: :user_registration
  end

  authenticated :user do
    root to: 'statements#index'
  end

  root to: redirect("/users/sign_in")

  scope 'users/:user_id' do
    resources :cards, only: %i[new create]
  end

  post 'api/baas/webhooks', to: 'api/baas#webhook'

  resources :statements, only: %i[edit update] do
    patch 'attach_invoice'
  end

  resources :users, only: %i[index]

  resources :companies, only: %i[new create] do
    resources :cards, only: %i[index create update]
    resources :users, only: %i[index create update]
    resources :categories, only: %i[index new create]
    resources :statements, only: :index
  end
end
