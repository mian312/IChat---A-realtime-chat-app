import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div style={{height: '80vh'}} className="d-flex justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12">
                <div className="card bg-light opacity-75 shadow-lg border-0 rounded-lg mx-auto py-2" style={{ width: "30rem" }}>
                    <h3 className="card-header display-1 text-muted text-center">
                        404
                    </h3>
                    <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted text-center">
                            Page Could Not Be Found
                        </h6>
                        <div className="text-center">
                            <Link to="/" className="btn btn-info btn-sm">Back To Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default NotFound
