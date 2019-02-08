class ChangeStartAndEndToBeStringInTodos < ActiveRecord::Migration[5.2]
  def change
    change_column :todos, :start, :string
    change_column :todos, :end, :string
  end
end
