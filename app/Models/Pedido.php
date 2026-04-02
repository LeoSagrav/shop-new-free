<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use BelongsToTenant;

    //
    protected $fillable = [
        'empresa_id',
        'cliente',
        'celular',
        'departamento',
        'pais',
        'total'
    ];


    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_productos')
                    ->withPivot('cantidad')
                    ->withTimestamps();
    }
}
