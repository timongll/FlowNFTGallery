import {useEffect} from "react"
import {useCurrentUser} from "./hooks/current-user"
import {useInit} from "./hooks/init"

const fmtBool = bool => (bool ? "yes" : "no")

export function InitCluster({address}) {
  
  const cu = useCurrentUser()
  const init = useInit(address)
  useEffect(() => init.check(), [address])

  if (address == null) return null

  return (
    <div>
      <h3>Init?: {address}</h3>
      <ul>
        <li>
          <strong>Profile: </strong>
          {init.isIdle && <span>{fmtBool(init.profile)}</span>}
          {!init.profile && cu.addr === address && init.isIdle && (
            <button disabled={init.isProcessing} onClick={init.exec}>
              Initialize Profile
            </button>
          )}
          {init.isProcessing && <span>PROCESSING</span>}
        </li>
      </ul>
    </div>
  )
}