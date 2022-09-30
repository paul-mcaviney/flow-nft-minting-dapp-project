import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 50px;

  button {
    width: 100px;
    padding: 10px;
    border: none;
    background-color: #8dfe89;
    border-radius: 10px;
    font-weight: 700;
    &:hover {
      color: white;
      background-color: black;
      cursor: pointer;
    }
  }

  section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 30px;
    padding: 10%;
  }

  .nftDiv{
    padding: 10px;
    background-color: #141414;
    border-radius: 20px;
    color: white;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
    img{
        width: 140px;
        border-radius: 10px;
    }
    p{
        font-size: 14px;
    }
  }
`;

export default function ShowNfts() {
  const [nfts, setNfts] = useState([]);
  const [user, setUser] = useState({ loggedIn: false, addr: undefined });

	useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    getNFTs(user.addr)
  }, [user.addr]);

  async function getNFTs(addr) {
    try {
      const result = await fcl.query({
        cadence: `
                import FlowTutorialMint from 0x8e0dac5df6e8489e
                import MetadataViews from 0x631e88ae7f1d7c20
                
                pub fun main(address: Address): [FlowTutorialMint.FlowTutorialMintData] {
                  let collection = getAccount(address).getCapability(FlowTutorialMint.CollectionPublicPath)
                                    .borrow<&{MetadataViews.ResolverCollection}>()
                                    ?? panic("Could not borrow a reference to the nft collection")
                
                  let ids = collection.getIDs()
                
                  let answer: [FlowTutorialMint.FlowTutorialMintData] = []
                
                  for id in ids {
                    
                    let nft = collection.borrowViewResolver(id: id)
                    let view = nft.resolveView(Type<FlowTutorialMint.FlowTutorialMintData>())!
                
                    let display = view as! FlowTutorialMint.FlowTutorialMintData
                    answer.append(display)
                  }
                    
                  return answer
                }
                `,
        args: (arg, t) => [arg(addr, t.Address)],
      });
      setNfts(result);
    } catch (error) {
      console.log("err", error);
    }
  }

  return (
    <Wrapper>
      <h1>My NFTs</h1>
      <main>
        <button onClick={() => getNFTs(user.addr)}>Get NFTs</button>
        <section>
          {nfts.map((nft, index) => {
            return (
              <div key={index} className="nftDiv">
                <img src={nft.url} alt="nft" />
                <p>Type: {nft.type}</p>
                <p>Id: {nft.id}</p>
              </div>
            );
          })}
        </section>
      </main>
    </Wrapper>
  );
}