class OwnersController < ApplicationController
  def index
    json_response(@owner)
  end

  def show
    json_response(@owner)
  end

  def create
    @owner.create!(owner_params)
    json_response(@owner, :created)
  end

  def update
    @owner.update(owner_params)
    head :no_content
  end

  private

  def owner_params
    params.permit(:name)
  end

  def set_owner
    @owner = Owner.find(params[:id])
  end

end
