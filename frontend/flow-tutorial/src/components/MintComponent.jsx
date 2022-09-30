import styled from "styled-components";
import * as fcl from "@onflow/fcl";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
  padding: 100px;

  main{
    display: flex;
  }

  div{
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  button{
    width: 100px;
    padding: 10px;
    border: none;
    background-color: #8dfe89;
    border-radius: 20px;
    font-weight: 500;
    &:hover {
      color: white;
      background-color: black;
      cursor: pointer;
    }
  }

  img{
    width: 200px;
  }
`;

function MintComponent() {
  async function mintNFT(type, url) {
    try {
      const res = await fcl.mutate({
        cadence: `
            import FlowTutorialMint from 0x8e0dac5df6e8489e
            import NonFungibleToken from 0x631e88ae7f1d7c20
            import MetadataViews from 0x631e88ae7f1d7c20

            transaction(type: String, url: String){
                let recipientCollection: &FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic}

                prepare(signer: AuthAccount){
                    
                if signer.borrow<&FlowTutorialMint.Collection>(from: FlowTutorialMint.CollectionStoragePath) == nil {
                signer.save(<- FlowTutorialMint.createEmptyCollection(), to: FlowTutorialMint.CollectionStoragePath)
                signer.link<&FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(FlowTutorialMint.CollectionPublicPath, target: FlowTutorialMint.CollectionStoragePath)
                }

                self.recipientCollection = signer.getCapability(FlowTutorialMint.CollectionPublicPath)
                                            .borrow<&FlowTutorialMint.Collection{NonFungibleToken.CollectionPublic}>()!
                }
                execute{
                    FlowTutorialMint.mintNFT(recipient: self.recipientCollection, type: type, url: url)
                }
            }
            `,
        args: (arg, t) => [arg(type, t.String), arg(url, t.String)],
        limit: 9999,
      });
      fcl.tx(res).subscribe((res) => {
        if (res.status === 4 && res.errorMessage === "") {
            window.alert("NFT Minted!")
            window.location.reload(false);
        }
      });

      console.log("txid", res);
    } catch (error) {
      console.log("err", error);
    }
  }

  return (
  <Wrapper>
    <h1>Mint your Dog!</h1>
    <main>
        <div>
            <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a" alt="Mad Dog"/>
            <h3>Mad Dog</h3>
            <button onClick={() => mintNFT("Mad Dog", "https://images.unsplash.com/photo-1517849845537-4d257902454a")}>Mint</button>
        </div>

        <div>
            <img src="https://images.unsplash.com/photo-1517423568366-8b83523034fd" alt="Swag Dog"/>
            <h3>Swag Dog</h3>
            <button onClick={() => mintNFT("Swag Dog", "https://images.unsplash.com/photo-1517423568366-8b83523034fd")}>Mint</button>
        </div>

        <div>
            <img src="https://images.unsplash.com/photo-1517519014922-8fc06b814a0e" alt="French Dog"/>
            <h3>French Dog</h3>
            <button onClick={() => mintNFT("French Dog", "https://images.unsplash.com/photo-1517519014922-8fc06b814a0e")}>Mint</button>
        </div>
    </main>
  </Wrapper>
  )
}

export default MintComponent;