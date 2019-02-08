class CreateTodos < ActiveRecord::Migration[5.2]
  def change
    create_table :todos do |t|
      t.string :title
      t.date :start
      t.date :end
      t.integer :owner_id

      t.timestamps
    end
  end
end
