module Counter exposing (main)

import Browser
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)

type alias Model = Int

type Msg = Increment | Decrement

update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment -> model + 1
    Decrement -> model - 1

view : Model -> Html Msg
view model =
  div [ style "display" "flex", style "align-items" "center", style "gap" "1.5rem", style "justify-content" "center" ]
    [ button [ onClick Decrement, style "padding" "0.5rem 1rem", style "font-size" "1.5rem", style "cursor" "pointer", style "border" "none", style "border-radius" "5px", style "background" "#ff6b6b", style "color" "white", style "transition" "background 0.3s", style "font-weight" "bold" ] [ text "-" ]
    , div [ style "font-size" "2rem", style "font-weight" "bold", style "min-width" "80px", style "text-align" "center", style "color" "white" ] [ text (String.fromInt model) ]
    , button [ onClick Increment, style "padding" "0.5rem 1rem", style "font-size" "1.5rem", style "cursor" "pointer", style "border" "none", style "border-radius" "5px", style "background" "#51cf66", style "color" "white", style "transition" "background 0.3s", style "font-weight" "bold" ] [ text "+" ]
    ]

main : Program () Model Msg
main =
  Browser.sandbox { init = 0, update = update, view = view }