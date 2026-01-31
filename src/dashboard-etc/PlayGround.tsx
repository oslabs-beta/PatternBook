// I'm labelling this as Playground.  Probably will be static for the MVP but just figured this was clear
import "../main.css";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/card.tsx";

function PlayGround() {
  return (
    <>
      <div className="flex justify-center text-white width-400px border border-color-blue-400">
        <p> playground / view documentaion </p>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default PlayGround;
