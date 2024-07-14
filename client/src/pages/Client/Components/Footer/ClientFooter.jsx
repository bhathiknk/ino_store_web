import React from 'react'
import Container from '../Nav/Container'
import FooterList from './FooterList'
import { Link } from 'react-router-dom'
import {MdFacebook} from 'react-icons/md'
import {AiFillTwitterCircle, AiFillInstagram} from 'react-icons/ai'


export default function ClientFooter() {
  return (
    <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
        <Container>
            <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
                   <FooterList>
                    <h3 className="text-base font-bold mb-2">Categories</h3>
                    <Link href="#">Category 1</Link>
                    <Link href="#">Category 2</Link>
                    <Link href="#">Category 3</Link>
                    <Link href="#">Category 4</Link>
                    <Link href="#">Category 4</Link>
                    <Link href="#">Category 6</Link>
                   </FooterList>

                   <FooterList>
                    <h3 className="text-base font-bold mb-2">Customer Service</h3>
                    <Link href="#">Contact Us</Link>
                   </FooterList>

                   <div className="w-full md:w-1/3 bm-6 md:mb-0">
                    <h3 className="text-base font-bold mb-2">About Us</h3>
                    <p className="mb-2"> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni repellendus eius illum tempore libero, iste dolor? Harum, labore? Suscipit, praesentium?</p>
                    <p>&copy; 2024 E-Com-Innovation. All rights reserved.</p>
                    </div>

                    <FooterList>
                    <h3 className="text-base font-bold mb-2">Follow Us</h3>
                    <div className="flex gap-2">
                    <Link href="#">
                     <MdFacebook size= {24}/>
                    </Link>
                    <Link href="#">
                     <AiFillInstagram size= {24}/>
                    </Link>
                    <Link href="#">
                     <AiFillTwitterCircle size= {24}/>
                    </Link>
                    </div>
                    </FooterList>
            </div>
        </Container>
      
    </footer>
  )
}
