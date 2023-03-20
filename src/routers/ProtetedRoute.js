import React from 'react'
import { user } from "../database/Auth/Auth";
import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { hasLogin } from '../database/Auth/Auth';

function ProtetedRoute() {
    return (
        hasLogin() ? <Outlet /> : <Navigate to="/account" />
    )
}

export default ProtetedRoute