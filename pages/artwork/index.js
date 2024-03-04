import validObjectIDList from "../../public/data/validObjectIDList.json";
import { useRouter } from "next/router";
import Error from "next/error";
import { useState, useEffect } from "react";
import { Row, Col, Pagination, Card } from "react-bootstrap";
import ArtworkCard from "../../components/ArtworkCard";
import useSWR from "swr";

let PER_PAGE = 12;


const fetcher = async (...args) => { const response = await fetch(...args)
  const data = await response.json() 
   return data }
  
export default function Artwork() {
  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1]; //The finalQuery variable is used to extract the query string from the route. The router.asPath gives the entire route, so it is split by the "?" character and only the query parameters are taken. This query is then used to fetch the data from the API.
  // console.log(finalQuery);
  
  const [artworkList, setArtworkList] = useState([]);
  const [page, setPage] = useState(1);

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`,
    fetcher
  );

  useEffect(() => {  // useEffect hook to update artworkList and page when data 
    if (data) {
      let results = [];
      let filteredResults = validObjectIDList.objectIDs.filter((x) =>   //filter out the data from validObjectIDList based on the objectIDs recieved from the api
        data.objectIDs?.includes(x)
      );

      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {       //iterate through the filtered results and push  number of results for each page into the results array
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  if (error) return <Error statusCode={404} />;

  if (!data) return <div>loading...</div>;

  function previousPage() {
    if (page > 1) {
      setPage((pageVal) => pageVal - 1);
    }
  }
  function nextPage() {
    if (page < artworkList.length) {
      setPage((pageVal) => pageVal + 1);
    }
  }
  return (
    <>
 
          <Row>{console.log(artworkList)}</Row>
      <Row className="gy-4">
        {artworkList.length != 0 ? (
          artworkList[page - 1]?.map((objectIDs) => (
            <Col lg={3} key={objectIDs}>  {/**The Col lg={3} is a Bootstrap component which is used to divide the row into 3 equal columns. */}
              <ArtworkCard objectID={objectIDs} />
            </Col>
          ))
        ) : (
          <Card>
            <h4>Nothing Here</h4>{" "}
          </Card>
        )}
      </Row>
      {artworkList.length > 1 ? (
        <Pagination>
          <Pagination.Prev onClick={previousPage} />
          <Pagination.Item>{page}</Pagination.Item>
          <Pagination.Next onClick={nextPage} />
        </Pagination>
      ) : null}
    </>
  );
}
